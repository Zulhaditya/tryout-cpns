import { NextResponse } from "next/server";
import db from '@/lib/db';

export async function GET() {
  try {
    const result = await db.query('SELECT * FROM packages ORDER BY created_at DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal fetching data paket soal' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description } = body;

    const result = await db.query(
      'INSERT INTO packages (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    )

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal membuat paket soal" }, { status: 500 });
  }
}
