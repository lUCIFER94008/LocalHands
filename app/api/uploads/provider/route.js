import { NextResponse } from 'next/server';
import { saveProviderImage } from '@/lib/upload';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') || formData.get('profilePhoto') || formData.get('image');

    if (!file) {
      return NextResponse.json(
        { success: false, error: { message: 'No image file uploaded' } },
        { status: 400 }
      );
    }

    const imageUrl = await saveProviderImage(file);

    return NextResponse.json({
      success: true,
      data: { url: imageUrl, imageUrl },
      message: 'Image uploaded successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Image upload failed' } },
      { status: 400 }
    );
  }
}
