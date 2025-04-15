import {useState} from "react";
import {Button} from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "./ui/dropdown-menu";
import {ChevronDownIcon} from "@radix-ui/react-icons";

interface DropdownMenuTemplateProps {
	options: { value: string, label: string, default?: boolean }[];
	onValueChange: (value: string) => void;
	title?: string;
}

const DropdownMenuTemplate: React.FC<DropdownMenuTemplateProps> = ({options, onValueChange, title}) => {
	const defaultOption = options.find(option => option.default);
	const [selectedValue, setSelectedValue] = useState(defaultOption?.value || options[0]?.value || '');
	
	const handleChange = (value: string) => {
		setSelectedValue(value);
		onValueChange(value);
	};
	
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">{title} : {options.find(option => option.value === selectedValue)?.label}
					<ChevronDownIcon className="h-4 w-4"/>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>{title}</DropdownMenuLabel>
				<DropdownMenuSeparator/>
				<DropdownMenuRadioGroup value={selectedValue} onValueChange={handleChange}>
					{options.map((option) => (
						<DropdownMenuRadioItem defaultChecked={option.default} key={option.value} value={option.value}>
							{option.label}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default DropdownMenuTemplate;