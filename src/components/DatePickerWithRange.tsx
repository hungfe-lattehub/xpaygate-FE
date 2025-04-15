import {CalendarIcon} from "@radix-ui/react-icons"
import {format} from "date-fns"
import {DateRange} from "react-day-picker"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import {useState} from "react";

type DatePickerProps = {
	onValueChange: (value: DateRange | undefined) => void;
	initValue?: DateRange;
};

export function DatePickerWithRange({onValueChange, initValue}: DatePickerProps) {
	const [date, setDate] = useState<DateRange | undefined>(initValue ? initValue : {
		from: undefined,
		to: undefined,
	})
	const onDateChange = (dateRange: DateRange | undefined) => {
		setDate(dateRange);
		onValueChange(dateRange);
	}
	return (
		<div className={cn("grid gap-2")}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant={"outline"}
						className={cn(
							"w-[300px] justify-start text-left font-normal h-10",
							!date && "text-muted-foreground"
						)}
					>
						<CalendarIcon className="mr-2 h-4 w-4"/>
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, "LLL dd, y")} -{" "}
									{format(date.to, "LLL dd, y")}
								</>
							) : (
								format(date.from, "LLL dd, y")
							)
						) : (
							<span>Pick a date</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						initialFocus
						mode="range"
						defaultMonth={date?.from}
						selected={date}
						onSelect={onDateChange}
						numberOfMonths={2}
					/>
				</PopoverContent>
			</Popover>
		</div>
	)
}
