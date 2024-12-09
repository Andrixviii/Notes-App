export interface ListItem {
  id: string;
  content: string;
  isCompleted: boolean;
}

export interface Todos {
  id: string;
  title: string;
  lists: ListItem[];
}
