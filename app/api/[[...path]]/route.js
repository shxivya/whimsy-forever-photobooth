import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME || 'photobooth';

let client;
let db;

async function getDb() {
  if (db) return db;
  client = new MongoClient(MONGO_URL);
  await client.connect();
  db = client.db(DB_NAME);
  return db;
}

function clean(doc) {
  if (!doc) return doc;
  const { _id, ...rest } = doc;
  return rest;
}

export async function GET(request, { params }) {
  try {
    const p = (params?.path || []).join('/');
    const database = await getDb();

    if (p === '' || p === 'health') {
      return NextResponse.json({ ok: true, service: 'tiny-forever-things' });
    }

    if (p === 'love-notes') {
      const notes = await database
        .collection('love_notes')
        .find({})
        .sort({ createdAt: -1 })
        .limit(60)
        .toArray();
      return NextResponse.json({ notes: notes.map(clean) });
    }

    if (p === 'gallery') {
      const items = await database
        .collection('gallery')
        .find({})
        .sort({ createdAt: -1 })
        .limit(40)
        .toArray();
      return NextResponse.json({ items: items.map(clean) });
    }

    return NextResponse.json({ error: 'not found' }, { status: 404 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const p = (params?.path || []).join('/');
    const database = await getDb();
    const body = await request.json().catch(() => ({}));

    if (p === 'love-notes') {
      const note = {
        id: uuidv4(),
        text: String(body.text || '').slice(0, 240),
        mood: body.mood || 'dreamy',
        createdAt: new Date().toISOString(),
      };
      if (!note.text.trim()) return NextResponse.json({ error: 'empty' }, { status: 400 });
      await database.collection('love_notes').insertOne({ ...note });
      return NextResponse.json({ note });
    }

    if (p === 'gallery') {
      const item = {
        id: uuidv4(),
        image: body.image,
        caption: String(body.caption || '').slice(0, 120),
        tag: body.tag || 'memory',
        createdAt: new Date().toISOString(),
      };
      if (!item.image) return NextResponse.json({ error: 'missing image' }, { status: 400 });
      await database.collection('gallery').insertOne({ ...item });
      return NextResponse.json({ item });
    }

    return NextResponse.json({ error: 'not found' }, { status: 404 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
