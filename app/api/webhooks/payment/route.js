import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with the Service Role Key to bypass Row Level Security (RLS)
// for backend administrative tasks like updating order statuses.
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
    try {
        // 1. Read the raw text body (required for cryptographic signature verification)
        const bodyText = await request.text();
        const signature = request.headers.get('x-paystack-signature');

        const secret = process.env.PAYSTACK_SECRET_KEY;

        if (!secret) {
            console.error('Missing PAYSTACK_SECRET_KEY in environment variables.');
            return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
        }

        // 2. Verify Webhook Signature (Security Check to prevent spoofed calls)
        const hash = crypto
            .createHmac('sha512', secret)
            .update(bodyText)
            .digest('hex');

        if (hash !== signature) {
            console.warn('Invalid signature detected on webhook request.');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        // 3. Parse the event payload
        const event = JSON.parse(bodyText);

        // 4. Handle successful payment events
        if (event.event === 'charge.success') {
            const data = event.data;

            // Paystack metadata passed during checkout initiation
            const orderId = data.metadata?.order_id;
            const paymentReference = data.reference;
            const amountPaid = data.amount / 100; // Convert cents back to major currency unit

            if (!orderId) {
                console.error('Webhook payload missing metadata order_id.');
                return NextResponse.json({ error: 'Order ID missing' }, { status: 400 });
            }

            // 5. Update Order Status in Supabase Database
            const { error: updateError } = await supabaseAdmin
                .from('orders')
                .update({
                    status: 'paid',
                    payment_reference: paymentReference,
                    amount_paid: amountPaid,
                    paid_at: new Date().toISOString(),
                })
                .eq('id', orderId);

            if (updateError) {
                console.error('Database update failed:', updateError.message);
                return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
            }

            // 6. Automatically create a initial Shipment Record for Tracking
            const { error: shipmentError } = await supabaseAdmin
                .from('shipments')
                .insert({
                    order_id: orderId,
                    status: 'processing',
                    status_description: 'Payment verified. Preparing order for dispatch.',
                    updated_at: new Date().toISOString(),
                });

            if (shipmentError) {
                console.error('Shipment creation error:', shipmentError.message);
            }

            console.log(`Order ${orderId} successfully marked as PAID.`);
        }

        // Acknowledge receipt to the payment gateway (Must return 200 OK)
        return NextResponse.json({ received: true }, { status: 200 });

    } catch (err: any) {
        console.error('Webhook error:', err.message);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}