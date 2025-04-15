import { ShieldX} from "lucide-react";

export default function Unauthorized() {
    return (<div className="flex items-center justify-center h-screen bg-gray-100">
        <ShieldX  size={50}/>
        <h1 className="text-3xl font-bold "> You don't have permission</h1>
    </div>)
}