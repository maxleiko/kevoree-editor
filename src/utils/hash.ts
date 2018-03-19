/* tslint:disable:no-bitwise */
export function hash(str: string): string {
    let val = 0;
    if (str.length === 0) {
        return val + '';
    }
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        val = ((val << 5) - val) + char;
        val = val & val; // Convert to 32bit integer
    }
    return (val & 0xfffffff) + '';
}