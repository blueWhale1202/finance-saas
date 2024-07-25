import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImportTable } from "./import-table";

import { convertAmountToMiliunits } from "@/lib/utils";
import { format, parse } from "date-fns";

const dateFormat = "yyyy-MM-dd HH:mm:ss";
const output = "yyyy-MM-dd";

const requireOptions = ["amount", "payee", "date"];

type Props = {
    data: string[][];
    onCancel: () => void;
    onSubmit: (data: any) => void;
};

interface SelectedColumnState {
    [key: string]: string | null;
}

export const ImportCard = ({ data, onSubmit, onCancel }: Props) => {
    const [selectedColumns, setSelectedColumns] = useState<SelectedColumnState>(
        {}
    );

    const headers = data[0];
    const body = data.slice(1);

    const onTableHeadChange = (columnIndex: number, value: string | null) => {
        setSelectedColumns((prev) => {
            const newSelectedColumns = { ...prev };

            for (const key in newSelectedColumns) {
                if (newSelectedColumns[key] === value) {
                    newSelectedColumns[key] = null;
                }
            }

            if (value === "skip") {
                value = null;
            }

            newSelectedColumns[`column-${columnIndex}`] = value;

            return newSelectedColumns;
        });
    };

    const process = Object.values(selectedColumns).filter(Boolean).length;

    const handleContinue = async () => {
        const keys = headers.map(
            (_, index) => selectedColumns[`column-${index}`] ?? null
        );

        const arrayOfData = body.map((row) => {
            const obj: Record<string, string> = {};

            row.forEach((cell, index) => {
                if (keys[index]) {
                    obj[keys[index] as string] = cell;
                }
            });

            return obj;
        });

        const formattedData = arrayOfData.map((data) => {
            return {
                ...data,
                amount: convertAmountToMiliunits(parseFloat(data.amount)),
                date: format(parse(data.date, dateFormat, new Date()), output),
            };
        });

        onSubmit(formattedData);
    };

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Import Transactions
                    </CardTitle>
                    <div className="flex flex-col gap-2 lg:flex-row">
                        <Button size="sm" onClick={onCancel}>
                            Cancel
                        </Button>

                        <Button
                            size="sm"
                            disabled={process !== requireOptions.length}
                            onClick={handleContinue}
                        >
                            Continue ({process}/{requireOptions.length})
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <ImportTable
                        headers={headers}
                        body={body}
                        selectedColumns={selectedColumns}
                        onTableHeadChange={onTableHeadChange}
                    />
                </CardContent>
            </Card>
        </div>
    );
};
