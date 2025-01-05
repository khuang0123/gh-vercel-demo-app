import { sql } from '@vercel/postgres';
import { formatCurrency } from './utils';

export async function fetchRevenue() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).

  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql`SELECT * FROM revenue`;

    // console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function totalPaidInvoices() {
  try {
    const data = await sql`
      SELECT COUNT(*) AS paid_invoices
      FROM invoices
      WHERE status = 'paid';
    `;
    const result = data.rows[0].paid_invoices;
    return result;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the paid invoices.');
  }
}

export async function totalPendingInvoices() {
  try {
    const data = await sql`
      SELECT COUNT(*) AS pending_invoices
      FROM invoices
      WHERE status = 'pending';
    `;
    const result = data.rows[0].pending_invoices;
    return result;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the pending invoices.');
  }
}

export async function numberOfInvoices() {
  try {
    const data = await sql`
      SELECT COUNT(id) AS id_count
      FROM invoices;
    `;
    // return data;
    const result = data.rows[0].id_count;
    return result;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the number of invoices.');
  }
}

export async function numberOfCustomers() {
  try {
    const data = await sql`
      SELECT COUNT(id) AS id_count
      FROM customers;
    `;
    // return data;
    const result = data.rows[0].id_count;
    return result;
  } catch (error) {}
}
