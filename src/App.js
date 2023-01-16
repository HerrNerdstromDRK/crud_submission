//import logo from "./logo.svg";
import "./App.css";

// useState is used by React to update the DOM and interface based on changes
// useRef allow us to capture data from user input via the web interface
// useEffect is a hook that allows us to store data persistently
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import BlogPosts, { blogPostsLoader } from "./pages/BlogPosts/BlogPosts";
import Faq from "./pages/help/Faq";
import Contact, { contactAction } from "./pages/help/Contact";
import BlogPost, {
  blogPostLoader,
  blogPostButtonHandler,
} from "./pages/BlogPosts/BlogPost";
import CreatePost, { createPostAction } from "./pages/BlogPosts/CreatePost";
import UpdatePost, {
  updatePostAction,
  updatePostLoader,
} from "./pages/BlogPosts/UpdatePost";
import Register from "./pages/Register";
import Login from "./pages/Login";

// Layouts
import RootLayout from "./layouts/RootLayout";
import HelpLayout from "./layouts/HelpLayout";
import BlogPostsLayout from "./layouts/BlogPostsLayout";
//import CreatePostLayout from "./layouts/CreatePostLayout";
import BlogPostsError from "./pages/BlogPosts/BlogPostError";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="help" element={<HelpLayout />}>
        <Route path="faq" element={<Faq />} />
        <Route path="contact" element={<Contact />} action={contactAction} />
      </Route>
      <Route path="register" element={<Register />} />
      <Route path="login" element={<Login />} />
      <Route
        path="blogposts"
        element={<BlogPostsLayout />}
        errorElement={<BlogPostsError />}
      >
        {/* A loader runs the function assigned each time we visit the page */}
        <Route index element={<BlogPosts />} loader={blogPostsLoader} />
        <Route
          path=":id"
          element={<BlogPost />}
          loader={blogPostLoader}
          action={blogPostButtonHandler}
        />
      </Route>
      <Route
        path="updatepost/:id"
        element={<UpdatePost />}
        loader={updatePostLoader}
        action={updatePostAction}
      />
      <Route
        path="createpost"
        element={<CreatePost />}
        action={createPostAction}
      />
      <Route path="*" element={<Home />} /> {/* catch-all path */}
    </Route>
  )
);

// Key used to store the array of todos locally
//const LOCAL_STORAGE_KEY = "todoApp.todos";

function App() {
  return <RouterProvider router={router} />;
}

/*
function App() {
  // Initialize an empty set of todos and create a hook for setting the state
  const [todos, setTodos] = useState([]);
  // Capture the name input from the todo
  const todoNameRef = useRef();

  // Read the array of stored todos from local storage
  // Do this only once -- use the empty array as dependency since it will never change
  useEffect(() => {
    // Retrieve the stored todos
    // The objects in storage are stored as a string
    const storedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    console.log("useEffect([])> storedTodos: " + JSON.stringify(storedTodos));
    if (storedTodos.length > 0) {
      console.log(
        "useEffect([])> storedTodos is not empty, calling setTodos()"
      );
      setTodos(storedTodos);
    }
  }, []);

  // Store the todos array into local storage
  // The [todos] is the dependency -- any time this changes, call useEffect()
  useEffect(() => {
    console.log("useEffect([todos])> Storing todos: " + JSON.stringify(todos));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  // Toggle the completion status of a todo
  function toggleTodo(id) {
    // Because React watches for changes in state, never directly modify an item in memory
    // Instead, make a copy here, update it, and hook into React
    const newTodos = [...todos];
    const todo = newTodos.find((todo) => todo.id === id);
    // Toggle the completion status of this todo
    console.log(
      "toggleTodo> Change completion state of todo " +
        JSON.stringify(todo) +
        " from " +
        todo.complete +
        " to " +
        !todo.complete
    );
    todo.complete = !todo.complete;

    // Update the todos list; this will trigger a React update
    setTodos(newTodos);
  }

  function handleAddTodo(e) {
    const name = todoNameRef.current.value;
    if (name === "") {
      console.log("handleAddTodo> Empty name field: " + JSON.stringify(e));
      return;
    }
    const newTodo = { id: uuidv4(), name: name, complete: false };
    console.log("handleAddTodo> created newTodo: " + JSON.stringify(newTodo));
    const newTodos = [...todos, newTodo];
    setTodos(newTodos);


    todoNameRef.current.value = null;
  }

  function handleClearTodos() {
    const newTodos = todos.filter((todo) => !todo.complete);
    setTodos(newTodos);
  }

  return (
    <>
      <TodoList todos={todos} toggleTodo={toggleTodo} />
      <input ref={todoNameRef} type="text" />
      <button onClick={handleAddTodo}>Add Todo</button>
      <button onClick={handleClearTodos}>Clear Completed Todos</button>
      <div>{todos.filter((todo) => !todo.complete).length} left to do</div>
    </>
  );
}
*/
/*
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );*/

export default App;
