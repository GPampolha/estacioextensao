interface AuthContextType {
    taskList:Array<PropCard>,
    onOpen:void,
	handleEdit:Function,
	handleDelete:Function,
	taskListBackup:Array<PropCard>,
	filter: (t: string) => void
}
type PropCard = {
    quantity: string,
	size: string,
	category: string, 
	flag:PropFlags,
	item: number, 
	timeLimit:string,
	title: string
}

type PropFlags = 'INSUFICIENTE'|'SUFICIENTE'|'EXCEDENTE'