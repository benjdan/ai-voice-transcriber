import OpenAI from 'openai';

/**
 * API route for transcribing audio files using OpenAI's Whisper model
 */
export async function POST(request: Request): Promise<Response> {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('file') as any;

    const openai = new OpenAI({ apiKey: '' });
    const response = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
    });
    return Response.json({ text: response.text });
  } catch (error) {
    console.error('POST ~ error:', error);
    return Response.json({ error: 'Failed to transcribe audio' }, { status: 500 });
  }
}
