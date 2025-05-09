import { NextResponse } from "next/server";
import db from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const packageId = searchParams.get('package_id');

  if (!packageId) {
    return NextResponse.json({ error: 'Missing package_id' }, { status: 400 });
  }

  try {
    const result = await db.query(
      'SELECT * FROM questions WHERE package_id = $1 ORDER BY id',
      [packageId]
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { package_id, category, sub_category, question, options, answer, explanation } = body;

    const result = await db.query(
      `INSERT INTO questions
       (package_id, category, sub_category, question, options, answer, explanation)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [package_id, category, sub_category, question, options, answer, explanation]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create question', detail: error.message }, { status: 500 });
  }
}
