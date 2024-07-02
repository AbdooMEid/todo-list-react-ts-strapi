import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import Button from "./ui/Button";

const TodoList = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  //** Fetching Api Use Query Hook
  const { isPending, data } = useAuthenticatedQuery({
    queryKey: ["todos"],
    url: "/users/me?populate=todos",
    config: { headers: { Authorization: `Bearer ${userData.jwt}` } },
  });
  console.log(data);
  if (isPending) return <h3>Loading...</h3>;
  return (
    <div className="space-y-1 ">
      <div className="flex w-fit mx-auto my-10 gap-x-2"></div>
      {data.todos.length ? (
        data.todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
          >
            <p className="w-full font-semibold">1 - {todo.title}</p>
            <div className="flex items-center justify-end w-full space-x-3">
              <Button variant={"default"} size={"sm"}>
                Edit
              </Button>
              <Button variant={"danger"} size={"sm"}>
                Remove
              </Button>
            </div>
          </div>
        ))
      ) : (
        <h3>not todos yet!</h3>
      )}
    </div>
  );
};

export default TodoList;
