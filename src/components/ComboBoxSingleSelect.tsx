import {CaretSortIcon, CheckIcon} from "@radix-ui/react-icons"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import {useState} from "react";

type ComboBoxTemplateProps = {
	data: { value: string; label: string }[];
	onValueChange: (values: string) => void;
	placeholder: string;
};

export function ComboboxSingleSelect({data, onValueChange, placeholder}: ComboBoxTemplateProps) {
	const [open, setOpen] = useState(false)
	const [value, setValue] = useState("")
	const handleClear = () => {
		setValue("");
		onValueChange("");
	};
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between"
				>
					{value
						? data.find((item) => item.label === value)?.label
						: placeholder}
					<CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput placeholder="Search Paygate..." className="h-9"/>
					<div>
						<Button className="mr-0 text-sky-600" variant="link" onClick={handleClear}>
							Clear
						</Button>
					</div>
					<CommandList>
						<CommandEmpty>No Paygate found.</CommandEmpty>
						<CommandGroup>
							{data.map((item) => (
								<CommandItem
									key={item.value}
									value={item.label}
									onSelect={(currentValue) => {
										setValue(currentValue === value ? "" : currentValue)
										setOpen(false)
										onValueChange(item.value)
									}}
								>
									{item.label}
									<CheckIcon
										className={cn(
											"ml-auto h-4 w-4",
											value === item.value ? "opacity-100" : "opacity-0"
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
