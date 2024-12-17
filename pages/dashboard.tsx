import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";
import Modal from "react-modal";

interface ListItem {
  id: string;
  content: string;
  isCompleted: boolean;
  time: string | null;
  note: string | null;
}

interface Todo {
  _id: string;
  title: string;
  lists: ListItem[];
}

Modal.setAppElement("#__next");

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskTime, setTaskTime] = useState("");
  const [taskNote, setTaskNote] = useState("");
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const fetchTodos = async (date?: string) => {
    try {
      const response = await axios.get<Todo[]>("/api/todo", {
        params: { date },
      });
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setTaskTitle("");
    setTaskTime("");
    setTaskNote("");
    setError("");
  };

  const openDetail = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setSelectedTodo(null);
    setIsDetailOpen(false);
  };

  const addTask = async () => {
    if (!taskTitle) {
      setError("Nama agenda harus diisi.");
      return;
    }
    const newTask = {
      title: taskTitle,
      lists: [
        {
          id:
            new Date().toISOString() + Math.random().toString(36).substring(2),
          content: taskTitle,
          isCompleted: false,
          time: taskTime || null,
          note: taskNote || null,
        },
      ],
    };
    try {
      const response = await axios.post<Todo>("/api/todo", newTask);
      setTodos([...todos, response.data]);
      closeModal();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    fetchTodos(e.target.value);
  };

  const deleteTask = async (taskId: string) => {
    try {
      await axios.delete(`/api/todo`, { params: { id: taskId } });
      setTodos(todos.filter((todo) => todo._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Terjadi kesalahan saat menghapus agenda.");
    }
  };

  const toggleListCompletion = async (
    taskId: string,
    listId: string,
    isCompleted: boolean
  ) => {
    try {
      await axios.patch(`/api/todo?id=${taskId}`, {
        listId,
        isCompleted: !isCompleted,
      });
      setTodos(
        todos.map((todo) =>
          todo._id === taskId
            ? {
                ...todo,
                lists: todo.lists.map((list) =>
                  list.id === listId
                    ? { ...list, isCompleted: !isCompleted }
                    : list
                ),
              }
            : todo
        )
      );
    } catch (error) {
      console.error("Error toggling list completion:", error);
    }
  };

  return (
    <>
      <Head>
        <title>Notes App</title>
      </Head>
      <div className="flex flex-col items-center bg-slate-100 min-h-screen relative">
        <header className="w-full bg-white shadow p-4 flex justify-between items-center">
          <h1
            className="flex text-4xl font-bold text-red-600 ml-8"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            <img className="w-9 h-9" src="icons.svg" alt="..." />
            otes
          </h1>

          <div className="flex">
            <Link href="/dashboard">
              <button className="text-gray-600 mr-6 mt-2">Dashboard</button>
            </Link>
            <Link href="/login">
              <button className="text-gray-600 mr-6 mt-2">Sign Out</button>
            </Link>

            <img className="w-12 mr-7" src="users.svg" alt="user" />
          </div>
        </header>
        <main className="flex-1 w-full max-w-3xl px-4">
          <div className="flex justify-between items-center mt-6">
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="appearance-none border rounded-lg p-2 w-full"
            />
          </div>
          <div className="mt-4">
            {todos.length === 0 ? (
              <p className="flex flex-col items-center text-center text-gray-500 mt-36">
                <img className="w-40 mb-3" src="empty.svg" alt="empty" />
                Tidak ada daftar agenda.
              </p>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo._id}
                  className="bg-white shadow rounded-md p-4 mt-4"
                >
                  <h2 className="font-semibold text-lg mb-2">{todo.title}</h2>
                  {todo.lists.map((list) => (
                    <div key={list.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={list.isCompleted}
                        onChange={() =>
                          toggleListCompletion(
                            todo._id,
                            list.id,
                            list.isCompleted
                          )
                        }
                        className="mr-2"
                      />
                      <span
                        className={
                          list.isCompleted ? "line-through text-gray-400" : ""
                        }
                      >
                        {list.content}
                      </span>
                      <span className="text-gray-500 ml-auto">
                        {list.time ? `🕒 ${list.time}` : ""}
                      </span>
                    </div>
                  ))}
                  <button
                    onClick={() => openDetail(todo)}
                    className="text-blue-500 mt-2 hover:text-blue-900 mr-2"
                  >
                    Detail
                  </button>
                  <button
                    onClick={() => deleteTask(todo._id)}
                    className="text-red-500 mt-2 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </main>

        <button
          onClick={openModal}
          className="fixed bottom-14 right-14 bg-gray-800 text-white rounded-full w-40 h-12 flex items-center justify-center shadow-lg z-10"
        >
          <span className="mr-2 text-2xl">+</span>Buat agenda
        </button>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Tambah Agenda"
          className="bg-white p-6 rounded-lg shadow-md mx-auto mt-20 max-w-md"
        >
          <h2 className="text-lg font-semibold mb-4">Tambah Agenda</h2>
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Masukkan nama agenda"
            className="border rounded-lg p-2 w-full mb-4"
          />
          <textarea
            value={taskNote}
            onChange={(e) => setTaskNote(e.target.value)}
            placeholder="Tambahkan catatan"
            className="border rounded-lg p-2 w-full mb-4"
          ></textarea>
          <input
            type="date"
            value={taskTime}
            onChange={(e) => setTaskTime(e.target.value)}
            className="border rounded-lg p-2 w-full mb-4"
          />
          <button
            onClick={addTask}
            className="bg-blue-500 text-white p-2 rounded-md w-full"
          >
            Tambah Agenda
          </button>
          {error && <p className="text-red-600 text-center mt-2">{error}</p>}
        </Modal>
        <Modal
          isOpen={isDetailOpen}
          onRequestClose={closeDetail}
          contentLabel="Detail Agenda"
          className="bg-white p-6 rounded-lg shadow-md mx-auto mt-20 max-w-md"
        >
          {selectedTodo && (
            <>
              <h2 className="text-lg font-semibold mb-4">Detail Agenda</h2>
              <p className="mb-4">
                <strong>Judul:</strong> {selectedTodo.title}
              </p>
              <ul className="mb-4">
                <strong>Daftar Agenda:</strong>
                {selectedTodo.lists.map((list) => (
                  <li key={list.id} className="mt-2">
                    <span>{list.content}</span>
                    <br />
                    <small className="text-gray-500">
                      {list.time ? `🕒 ${list.time}` : ""}
                    </small>
                  </li>
                ))}
              </ul>
              <p className="mb-4">
                <strong>Catatan:</strong>{" "}
                {selectedTodo.lists[0].note || "Tidak ada catatan."}
              </p>
              <button
                onClick={closeDetail}
                className="bg-gray-400 text-white p-2 rounded-md w-full mt-2"
              >
                Tutup
              </button>
            </>
          )}
        </Modal>
      </div>
    </>
  );
}
