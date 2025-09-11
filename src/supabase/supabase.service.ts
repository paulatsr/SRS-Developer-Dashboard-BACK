import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error(
        'Supabase URL and ANON KEY must be provided in environment variables',
      );
    }

    this.supabase = createClient(url, key);
  }

  async uploadFile(
    file: Express.Multer.File,
    bucket: string,
    fileName: string,
  ): Promise<{ url: string; path: string }> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        duplex: 'half',
      });

    if (error) {
      throw new Error(`File upload failed: ${error.message}`);
    }

    const { data: urlData } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      url: urlData.publicUrl,
      path: data.path,
    };
  }

  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await this.supabase.storage.from(bucket).remove([path]);

    if (error) {
      throw new Error(`File deletion failed: ${error.message}`);
    }
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
}
