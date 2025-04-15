// FileInput.tsx
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FileInputProps {
	register: any;
	onFilesChange: (files: FileList | null) => void;
}

const fileListFromArray = (files: File[]): FileList => {
	const dataTransfer = new DataTransfer();
	files.forEach(file => dataTransfer.items.add(file));
	return dataTransfer.files;
};

export const FileInput: React.FC<FileInputProps> = ({ register, onFilesChange }) => {
	const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
	
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			const newFiles = Array.from(event.target.files);
			setSelectedFiles(prevFiles => {
				const fileSet = new Set(prevFiles ? Array.from(prevFiles) : []);
				newFiles.forEach(file => fileSet.add(file));
				const updatedFiles = fileListFromArray([...fileSet]);
				onFilesChange(updatedFiles);
				return updatedFiles;
			});
		}
	};
	
	const handleFileRemove = (fileToRemove: File) => {
		setSelectedFiles(prevFiles => {
			if (prevFiles) {
				const updatedFiles = Array.from(prevFiles).filter(file => file !== fileToRemove);
				const newFileList = fileListFromArray(updatedFiles);
				onFilesChange(newFileList);
				return newFileList;
			}
			return null;
		});
	};
	
	return (
		<div className="space-y-4">
			<Label htmlFor="file" className="block text-sm font-medium text-gray-700">
				File (Optional)
			</Label>
			<Input
				id="file"
				type="file"
				{...register("file")}
				multiple
				onChange={handleFileChange}
				className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
			/>
			{selectedFiles && (
				<div className="mt-4 space-y-2">
					{Array.from(selectedFiles).map((file, index) => (
						<div
							key={index}
							className="flex items-center justify-between p-2 border rounded-md bg-gray-100"
						>
							<span className="text-sm text-gray-700">{file.name}</span>
							<button
								type="button"
								onClick={() => handleFileRemove(file)}
								className="px-3 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded hover:bg-red-200"
							>
								Remove
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	
	);
};