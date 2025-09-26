// Function to convert number to words
// It supports numbers up to 999,999,999,999

const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
const thousands = ['', 'Thousand', 'Million', 'Billion'];

function convertLessThanOneThousand(num: number): string {
    if (num === 0) {
        return '';
    }

    let result = '';
    if (num >= 100) {
        result += ones[Math.floor(num / 100)] + ' Hundred ';
        num %= 100;
    }

    if (num >= 20) {
        result += tens[Math.floor(num / 10)] + ' ';
        num %= 10;
    } else if (num >= 10) {
        return result + teens[num - 10] + ' ';
    }

    if (num > 0) {
        result += ones[num] + ' ';
    }

    return result;
}

export function numberToWords(num: number): string {
    if (num === 0) {
        return 'Zero';
    }
    
    if (num > 999999999999) {
        return "Number too large";
    }

    let result = '';
    let i = 0;

    do {
        const chunk = num % 1000;
        if (chunk !== 0) {
            result = convertLessThanOneThousand(chunk) + thousands[i] + ' ' + result;
        }
        num = Math.floor(num / 1000);
        i++;
    } while (num > 0);

    return result.trim();
}
