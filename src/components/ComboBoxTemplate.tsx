import * as React from "react";
import {Check, ChevronsUpDown} from "lucide-react";
import {cn} from "@/lib/utils"; // Utility for conditional classnames
import {Button} from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {ComboxBoxItem} from "@/type/ComboxBoxItem.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {useState} from "react";

type ComboBoxTemplateProps = {
	data: ComboxBoxItem[];
	onValueChange: (values: string[]) => void;
	placeholder: string;
};

export function ComboBoxTemplate({data, onValueChange, placeholder}: ComboBoxTemplateProps) {
	const [open, setOpen] = React.useState(false);
	const [selectedValues, setSelectedValues] = React.useState<string[]>([]);
	const [isSelectAll, setIsSelectAll] = useState<boolean>(false)

	const checkDataSubmit = (dataSelected: string[]) => {
		return dataSelected.map((name) => data.find((item) => item.name === name)?.id || "")
	}


	const handleSelect = (currentValue: ComboxBoxItem) => {
		const isSelected = selectedValues.includes(currentValue.name);
		let newValues;
		if (isSelected) {
			newValues = selectedValues.filter((value) => value !== currentValue.name);
		} else {
			newValues = [...selectedValues, currentValue.name];
		}

		console.log('newValues', newValues)

		onValueChange(newValues.map((name) => data.find((item) => item.name === name)?.id || ""));

		console.log('submit', newValues.map((name) => data.find((item) => item.name === name)?.id || ""))

		setSelectedValues(newValues);
	};
	
	const handleClear = () => {
		setSelectedValues([]);
		onValueChange([]);
	};

	const handleSelectAll = () => {
		if(selectedValues.length > 0) {
			setSelectedValues([])
			setIsSelectAll(false)
			onValueChange([])
		}
		else {
			setIsSelectAll(true)
			const allDataSubmit: string[] = []
			data.map((item) => allDataSubmit.push(item.name))

			setSelectedValues(allDataSubmit)
			onValueChange(checkDataSubmit(allDataSubmit))
		}
	}
	
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="h-10 justify-between"
				>
					{selectedValues.length > 0 ? selectedValues.length +" selected" : placeholder}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput placeholder="Search..." className="h-9"/>
					<div className='flex justify-between items-center mr-4'>
						<Button className="mr-0 text-sky-600" variant="link" onClick={handleClear}>
							Clear
						</Button>
						<Checkbox onClick={handleSelectAll} checked={isSelectAll} />
					</div>
					<CommandEmpty>No items found.</CommandEmpty>
					<CommandGroup>
						<CommandList key="list-paygate">
							{data.map((item) => (
								<CommandItem
									key={item.id}
									value={item.name}
									onSelect={() => handleSelect(item)}
								>
									{item.name} {item.type && <>({item.type})</>}
									<Check
										className={cn(
											"ml-auto h-4 w-4",
											selectedValues.includes(item.name) ? "opacity-100" : "opacity-0"
										)}
									/>
								</CommandItem>
							))}
						</CommandList>
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
