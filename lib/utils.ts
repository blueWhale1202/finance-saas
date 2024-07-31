import { type ClassValue, clsx } from "clsx";
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function convertAmountToMiliunits(amount: number) {
    return Math.round(amount * 1000);
}

export function convertMiliunitsToAmount(amount: number) {
    return amount / 1000;
}

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(amount);
}

export function calculatePercentageChange(previous: number, current: number) {
    if (previous === 0) {
        return 0;
    }
    return ((current - previous) / previous) * 100;
}

export function fillMissingDays(
    activeDays: {
        date: Date;
        income: number;
        expense: number;
    }[],
    startDate: Date,
    endDate: Date
) {
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const filledDays = days.map((date) => {
        const found = activeDays.find((day) => isSameDay(day.date, date));

        if (found) {
            return found;
        }

        return {
            date,
            income: 0,
            expense: 0,
        };
    });

    return filledDays;
}

type Period = {
    from: string | Date | undefined;
    to: string | Date | undefined;
};

export function formatDateRange(period: Period) {
    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo, 30);

    if (!period.from) {
        return `${format(defaultFrom, "LLL dd")} - ${format(
            defaultTo,
            "LLL dd y"
        )}`;
    }

    if (period.to) {
        return `${format(period.from, "LLL dd")} - ${format(
            period.to,
            "LLL dd y"
        )}`;
    }

    return `${format(period.from, "LLL dd")} - Present`;
}

export function formatPercentage(
    value: number,
    option: { addPrefix: boolean } = { addPrefix: false }
) {
    const result = new Intl.NumberFormat("en-US", {
        style: "percent",
        minimumFractionDigits: 2,
    }).format(value / 100);

    if (option.addPrefix && value > 0) {
        return `+${result}`;
    }

    return result;
}
