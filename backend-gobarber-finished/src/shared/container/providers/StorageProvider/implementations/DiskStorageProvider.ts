import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

export default class DiskStorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(uploadConfig.tmpfolder, file),
      path.resolve(uploadConfig.uploadsFolde, file),
    );
    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.uploadsFolde, file);
    try {
      // stat tras informações sobre o arquivo, se nao encontrar da erro
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    // deleta
    await fs.promises.unlink(filePath);
  }
}
