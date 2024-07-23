"use client";

import { useMemo } from "react";
import { SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";

type Props = {
    value?: string | null | undefined;
    placeholder?: string;
    disabled?: boolean;
    options?: { label: string; value: string }[];
    onChange: (value?: string) => void;
    onCreate?: (name: string) => void;
};

export const Select = ({
    options,
    value,
    placeholder,
    disabled,
    onChange,
    onCreate,
}: Props) => {
    const onSelect = (
        option: SingleValue<{ label: string; value: string }>
    ) => {
        onChange(option?.value);
    };

    const formattedValue = useMemo(() => {
        return options?.find((option) => option.value === value);
    }, [options, value]);

    return (
        <CreatableSelect
            // This style match with style of input component
            className="h-10 text-sm"
            styles={{
                control: (base) => ({
                    ...base,
                    borderColor: "#e2e8f0",
                    ":hover": { borderColor: "#cbd5e0" },
                }),
            }}
            isDisabled={disabled}
            options={options}
            value={formattedValue}
            placeholder={placeholder}
            onChange={onSelect}
            onCreateOption={onCreate}
        />
    );
};
