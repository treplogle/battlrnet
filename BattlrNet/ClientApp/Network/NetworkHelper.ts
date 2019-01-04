export default class NetworkHelper {

    // ArrayBuffer to String (Unicode UTF-16)
    static ArrayBufferToString(buffer: ArrayBuffer) {
        return String.fromCharCode.apply(undefined, new Uint16Array(buffer));
    }

    // String to ArrayBuffer (Unicode UTF-16)
    static StringToArrayBuffer(str: string, buffer: ArrayBuffer, offset: number) {
        const view = new Uint16Array(buffer, offset);
        const strLen = str.length;

        for (let i = 0; i < strLen; i++) {
            view[i] = str.charCodeAt(i);
        }
    }
}