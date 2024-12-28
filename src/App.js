import {
  Button,
  Container,
  Text,
  Title,
  Modal,
  TextInput,
  Group,
  Card,
  ActionIcon,
  Select,
} from "@mantine/core";
import { useState, useRef, useEffect } from "react";
import { MoonStars, Sun, Trash, Edit } from "tabler-icons-react";

import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [opened, setOpened] = useState(false);
  const [editOpened, setEditOpened] = useState(false);
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);

  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  const taskTitle = useRef("");
  const taskSummary = useRef("");
  const [taskState, setTaskState] = useState("Not done");
  const [taskDeadline, setTaskDeadline] = useState("");

  const [editTitle, setEditTitle] = useState("");
  const [editSummary, setEditSummary] = useState("");
  const [editState, setEditState] = useState("");
  const [editDeadline, setEditDeadline] = useState("");

  function createTask() {
    const newTask = {
      title: taskTitle.current.value,
      summary: taskSummary.current.value,
      state: taskState,
      deadline: taskDeadline,
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  }

  function deleteTask(index) {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  }

  function editTask(index) {
    const task = tasks[index];
    setEditingTaskIndex(index);
    setEditTitle(task.title);
    setEditSummary(task.summary);
    setEditState(task.state);
    setEditDeadline(task.deadline);
    setEditOpened(true);
  }

  function saveEditedTask() {
    const updatedTasks = [...tasks];
    updatedTasks[editingTaskIndex] = {
      title: editTitle,
      summary: editSummary,
      state: editState,
      deadline: editDeadline,
    };
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setEditOpened(false);
  }

  function loadTasks() {
    const loadedTasks = localStorage.getItem("tasks");
    if (loadedTasks) setTasks(JSON.parse(loadedTasks));
  }

  function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme, defaultRadius: "md" }}
        withGlobalStyles
        withNormalizeCSS
      >
        <div className="App">
          {/* New Task Modal */}
          <Modal
            opened={opened}
            size={"md"}
            title={"New Task"}
            withCloseButton={false}
            onClose={() => setOpened(false)}
            centered
          >
            <TextInput
              mt={"md"}
              ref={taskTitle}
              placeholder={"Task Title"}
              required
              label={"Title"}
            />
            <TextInput
              ref={taskSummary}
              mt={"md"}
              placeholder={"Task Summary"}
              label={"Summary"}
            />
            <Select
              label="State"
              placeholder="Select state"
              value={taskState}
              onChange={setTaskState}
              data={["Not done", "Doing right now", "Done"]}
              mt="md"
            />
            <TextInput
              label="Deadline"
              placeholder="YYYY-MM-DD"
              value={taskDeadline}
              onChange={(e) => setTaskDeadline(e.target.value)}
              type="date"
              mt="md"
            />
            <Group mt={"md"} position={"apart"}>
              <Button variant={"subtle"} onClick={() => setOpened(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  createTask();
                  setOpened(false);
                }}
              >
                Create Task
              </Button>
            </Group>
          </Modal>

         
          <Modal
            opened={editOpened}
            size={"md"}
            title={"Edit Task"}
            withCloseButton={false}
            onClose={() => setEditOpened(false)}
            centered
          >
            <TextInput
              mt={"md"}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder={"Task Title"}
              required
              label={"Title"}
            />
            <TextInput
              mt={"md"}
              value={editSummary}
              onChange={(e) => setEditSummary(e.target.value)}
              placeholder={"Task Summary"}
              label={"Summary"}
            />
            <Select
              label="State"
              placeholder="Select state"
              value={editState}
              onChange={setEditState}
              data={["Not done", "Doing right now", "Done"]}
              mt="md"
            />
            <TextInput
              label="Deadline"
              placeholder="YYYY-MM-DD"
              value={editDeadline}
              onChange={(e) => setEditDeadline(e.target.value)}
              type="date"
              mt="md"
            />
            <Group mt={"md"} position={"apart"}>
              <Button variant={"subtle"} onClick={() => setEditOpened(false)}>
                Cancel
              </Button>
              <Button onClick={saveEditedTask}>Save Changes</Button>
            </Group>
          </Modal>

          <Container size={550} my={40}>
            <Group position={"apart"}>
              <Title
                sx={(theme) => ({
                  fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                  fontWeight: 900,
                })}
              >
                My Tasks
              </Title>
              <ActionIcon
                color={"blue"}
                onClick={() => toggleColorScheme()}
                size="lg"
              >
                {colorScheme === "dark" ? <Sun size={16} /> : <MoonStars size={16} />}
              </ActionIcon>
            </Group>
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <Card withBorder key={index} mt={"sm"}>
                  <Group position={"apart"}>
                    <Text weight={"bold"}>{task.title}</Text>
                    <Group>
                      <ActionIcon
                        onClick={() => editTask(index)}
                        color={"blue"}
                        variant={"transparent"}
                      >
                        <Edit />
                      </ActionIcon>
                      <ActionIcon
                        onClick={() => deleteTask(index)}
                        color={"red"}
                        variant={"transparent"}
                      >
                        <Trash />
                      </ActionIcon>
                    </Group>
                  </Group>
                  <Text color={"dimmed"} size={"md"} mt={"sm"}>
                    {task.summary || "No summary provided"}
                  </Text>
                  <Text size={"sm"} mt={"xs"}>
                    State: {task.state}
                  </Text>
                  <Text size={"sm"} mt={"xs"}>
                    Deadline: {task.deadline || "No deadline set"}
                  </Text>
                </Card>
              ))
            ) : (
              <Text size={"lg"} mt={"md"} color={"dimmed"}>
                You have no tasks
              </Text>
            )}
            <Button onClick={() => setOpened(true)} fullWidth mt={"md"}>
              New Task
            </Button>
          </Container>
        </div>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
