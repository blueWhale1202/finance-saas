import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";

type Props = {
    account: string;
    accountId: string;
};

export const AccountColum = ({ account, accountId }: Props) => {
    const { onOpen } = useOpenAccount();
    return (
        <div
            className="flex items-center cursor-pointer hover:underline"
            onClick={() => onOpen(accountId)}
        >
            {account}
        </div>
    );
};
