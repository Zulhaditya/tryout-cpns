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

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, package_id, category, sub_category, question, options, answer, explanation } = body;

    const result = await db.query(
      `UPDATE questions
       SET package_id = $1,
           category = $2,
           sub_category = $3,
           question = $4,
           options = $5,
           answer = $6,
           explanation = $7
       WHERE id = $8 RETURNING *`,
      [package_id, category, sub_category, question, options, answer, explanation, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update question', detail: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing question id' }, { status: 400 });
    }

    const result = await db.query(
      'DELETE FROM questions WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Question deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete question', detail: error.message }, { status: 500 });
  }
}

