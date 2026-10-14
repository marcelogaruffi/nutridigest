import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

export const isNative = (): boolean => Capacitor.isNativePlatform();

/** Salva um arquivo de texto e abre o menu de compartilhar do Android. */
export async function shareTextFile(filename: string, content: string, title: string) {
  const written = await Filesystem.writeFile({
    path: filename,
    data: content,
    directory: Directory.Cache,
    encoding: Encoding.UTF8,
  });
  await Share.share({ title, files: [written.uri], dialogTitle: title });
}

/** Abre o menu de compartilhar com texto puro (WhatsApp, e-mail...). */
export async function shareText(text: string, title: string) {
  await Share.share({ title, text, dialogTitle: title });
}
