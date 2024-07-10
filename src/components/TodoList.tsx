import { ChangeEvent, FormEvent, useState } from "react";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import { ITodo } from "../interfaces";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Modal from "./ui/Modal";
import Textarea from "./ui/Textarea";
import axiosInstance from "../config/axios.config";
import InputErrorMessage from "./ui/InputErrorMessage";

const TodoList = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isToggleEditTodo, setIsToggleEditTodo] = useState(false);
  const [isToggleRemoveTodo, setIsToggleRemoveTodo] = useState(false);
  const [todoEdit, setTodoEdit] = useState<ITodo>({
    id: 0,
    title: "",
    description: "",
  });
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  //** Fetching Api Use Query Hook
  const { isPending, data } = useAuthenticatedQuery({
    queryKey: ["todoList", `${todoEdit.id}`],
    url: "/users/me?populate=todos",
    config: { headers: { Authorization: `Bearer ${userData.jwt}` } },
  });

  //** Handler Toggle Edit
  const onCloseEditTodo = () => {
    setTodoEdit({ id: 0, title: "", description: "" });
    setIsToggleEditTodo(false);
  };
  const onOpenEditTodo = (todo: ITodo) => {
    setTodoEdit(todo);
    setIsToggleEditTodo(true);
  };
  
  const onCloseRemoveTodo = () => setIsToggleRemoveTodo(false);
  const onOpenRemoveTodo = () => setIsToggleRemoveTodo(true);
  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTodoEdit({
      ...todoEdit,
      [name]: value,
    });
  };
  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    const { id, title, description } = todoEdit;

    try {
      const { status } = await axiosInstance.put(
        `todos/${id}`,
        { data: { title, description } },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        }
      );
      if (status === 200) {
        onCloseEditTodo();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isPending) return <h3>Loading...</h3>;

  return (
    <div className="space-y-1 ">
      <div className="flex w-fit mx-auto my-10 gap-x-2"></div>
      {data.todos.length ? (
        data.todos.map((todo: ITodo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
          >
            <p className="w-full font-semibold">1 - {todo.title}</p>
            <div className="flex items-center justify-end w-full space-x-3">
              <Button
                variant={"default"}
                size={"sm"}
                onClick={() => onOpenEditTodo(todo)}
              >
                Edit
              </Button>
              <Button variant={"danger"} size={"sm"} onClick={onOpenRemoveTodo}>
                Remove
              </Button>
            </div>
          </div>
        ))
      ) : (
        <h3>not todos yet!</h3>
      )}

      {/** Edit Model */}
      <Modal isOpen={isToggleEditTodo} closeModal={onCloseEditTodo}>
        <form className="space-y-3" onSubmit={submitHandler}>
          <Input
            name="title"
            value={todoEdit.title}
            onChange={onChangeHandler}
          />
          {todoEdit.title.length <= 0 ? (
            <InputErrorMessage msg="please Enter your title" />
          ) : null}
          <Textarea
            name="description"
            value={todoEdit.description}
            onChange={onChangeHandler}
          />
          <div className="flex items-center justify-between space-x-2">
            <Button
              fullWidth
              isLoading={isUpdating}
              disabled={todoEdit.title.length <= 0}
            >
              Updated
            </Button>
            <Button variant={"cancel"} fullWidth onClick={onCloseEditTodo}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
      {/** Remove Model */}
      <Modal
        title="Remove Todo"
        description="Are You Sure Remove Todo?"
        isOpen={isToggleRemoveTodo}
        closeModal={onCloseRemoveTodo}
      >
        <div className="flex items-center justify-between space-x-2">
          <Button variant={"danger"} fullWidth>
            Yes, Remove
          </Button>
          <Button variant={"cancel"} fullWidth onClick={onCloseRemoveTodo}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TodoList;
