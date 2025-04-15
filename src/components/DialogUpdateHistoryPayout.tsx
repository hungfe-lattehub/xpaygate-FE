import {Dialog, DialogContent} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button.tsx";
import {Textarea} from "@/components/ui/textarea";
import {useState} from "react";
import {updateNote} from "@/service/ConfigPayout.tsx";
import {toast} from "@/components/ui/use-toast.ts";

export function DialogUpdateHistoryPayout({isDialogOpen, setIsDialogOpen, historyID, historyNote, setReloadKey}: {
	isDialogOpen: boolean,
	setIsDialogOpen: (open: boolean) => void;
	historyID: string;
	historyNote: string;
	setReloadKey: (key: number) => void;
}) {
	const [note, setNote] = useState<string>(historyNote)
	
	
	const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setNote(event.target.value);
	}
	
	const handleUpdateClick = () => {
		updateNote(historyID, note).then((response) => {
			setIsDialogOpen(false);
			if (response && response.status === 200) {
				toast({
					title: "Update Note Success",
					description: `Note has been updated successfully!`,
				})
				setReloadKey(Date.now());
			} else {
				toast({
					variant: "destructive",
					title: "Update Note Failed",
					description: `Failed to update note!`,
				})
			}
		})
	}
	
	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogContent className="sm:max-w-[625px]">
				<Textarea value={note} onChange={handleNoteChange} placeholder="Type your note here."/>
				<Button onClick={handleUpdateClick}>Update</Button>
			</DialogContent>
		</Dialog>
	)
}