import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { TableHeadSelect } from "./table-head-select";

type Props = {
    headers: string[];
    body: string[][];
    selectedColumns: Record<string, string | null>;
    onTableHeadChange: (columnIndex: number, value: string | null) => void;
};

export const ImportTable = ({
    headers,
    body,
    selectedColumns,
    onTableHeadChange,
}: Props) => {
    return (
        <div className="rounded-md overflow-hidden border">
            <Table>
                <TableHeader className="bg-muted">
                    <TableRow>
                        {headers.map((_, index) => (
                            <TableHead key={index}>
                                <TableHeadSelect
                                    columnIndex={index}
                                    selectedColumns={selectedColumns}
                                    onTableHeadChange={onTableHeadChange}
                                />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {body.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <TableCell key={cellIndex}>{cell}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
