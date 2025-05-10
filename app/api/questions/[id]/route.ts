import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await req.json();
    const { package_id, category, sub_category, question, options, answer, explanation } = body;

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

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    const result = await db.query(`DELETE FROM questions WHERE id = $1 RETURNING *`, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete question', detail: error.message }, { status: 500 });
  }
}

