import { NextRequest, NextResponse } from "next/server";
import prisma from "@/data/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');

    // Валидация параметров
    if (!fromParam || !toParam) {
      return NextResponse.json(
        { error: "Missing 'from' or 'to' parameters" },
        { status: 400 }
      );
    }

    const from = new Date(parseInt(fromParam));
    const to = new Date(parseInt(toParam));

    // Валидация дат
    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    // Установка временных границ
    from.setHours(0, 0, 0, 0);
    to.setHours(23, 59, 59, 999);

    // Запрос к базе данных
    const records = await prisma.record.findMany({
      where: {
        time: {
          gte: from,
          lte: to
        }
      },
      orderBy: {
        time: 'asc'
      }
    });

    // Возвращаем ответ с файлом для скачивания
    return new NextResponse(JSON.stringify(records), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename=weather.json'
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}