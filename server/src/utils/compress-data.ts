import zlib from "zlib";
import { promisify } from "util";

const gzipAsync = promisify(zlib.gzip);
const unzipAsync = promisify(zlib.unzip);

export async function compressText(text: string) {
    try {
        const compressed = await gzipAsync(text);

        return compressed;
    } catch (error) {
        throw new Error(`Gagal mengompresi teks: ${(error as Error).message}`);
    }
}

export async function decompressText(buffer: Buffer) {
    try {
        const decompressed = await unzipAsync(buffer);

        return decompressed;
    } catch (error) {
        throw new Error(
            `Gagal mendekompresi teks: ${(error as Error).message}`
        );
    }
}

export function convertBufferToString(data: Buffer) {
    try {
        const str = data.toString("utf-8");

        return str;
    } catch (error) {
        throw new Error(
            `Gagal mengkonversi buffer ke string: ${(error as Error).message}`
        );
    }
}
