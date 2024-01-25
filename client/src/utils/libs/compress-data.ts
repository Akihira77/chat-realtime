import pako from "pako";
import { Buffer } from "buffer";

export async function compressText(text: string): Promise<Buffer> {
	try {
		const compressed = pako.gzip(text);

		const buffer = Buffer.from(compressed);
		return Promise.resolve(buffer);
	} catch (error) {
		throw new Error(`Gagal mengompresi teks: ${(error as Error).message}`);
	}
}

export async function decompressText(buffer: Buffer): Promise<Buffer> {
	try {
		const binaryData = Buffer.from(buffer);
		const decompressedData = pako.ungzip(binaryData);

		// Menggunakan TextDecoder untuk mengonversi Uint8Array ke string
		// const textDecoder = new TextDecoder("utf-8");
		// const decodedData = textDecoder.decode(decompressedData);

		const toBuffer = Buffer.from(decompressedData);
		return Promise.resolve(toBuffer);
	} catch (error) {
		throw new Error(
			`Gagal mendekompresi teks: ${(error as Error).message}`
		);
	}
}

export function convertBufferToString(data: Buffer): string {
	try {
		const str = data.toString("utf-8");

		return str;
	} catch (error) {
		throw new Error(
			`Gagal mengkonversi buffer ke string: ${(error as Error).message}`
		);
	}
}

export function convertTextToBuffer(text: string): Buffer {
	const buffer = Buffer.from(text);

	return buffer;
}
