import { NextResponse } from 'next/server';
import { saveProviderImage } from '@/lib/upload';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') || formData.get('profilePhoto') || formData.get('image');

    if (!file) {
      return NextResponse.json(
        { success: false, error: { message: 'No image file uploaded. Please select a profile photo.' } },
        { status: 400 }
      );
    }

    const result = await saveProviderImage(file);

    return NextResponse.json({
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId,
        imageUrl: result.url, // backwards compatibility
      },
      message: 'Image uploaded successfully to Cloudinary',
    });
  } catch (error) {
    const errorMessage = error.message || 'Image upload failed. Please try again.';
    console.error('Provider image upload error:', errorMessage);

    return NextResponse.json(
      {
        success: false,
        error: {
          message: errorMessage,
        },
      },
      { status: 400 }
    );
  }
}
