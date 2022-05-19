import { Accessor, Component, createContext, createSignal, For, JSX, onCleanup, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { Portal } from "solid-js/web";
import styles from "src/styles/toast.module.css";

export const useToast = () => {

  const { count, increment, decrement } = useContext(ToastContext)!;
  increment();

  const [toasts, setToast] = createStore<string[]>([]);
  const timeouts: NodeJS.Timeout[] = [];
  const toast = (content: string, timeout = 5000) => {
    setToast([...toasts, content]);
    const instance = setTimeout(() => setToast(toasts.slice(1)), timeout);
    timeouts.push(instance);
  };
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = styles.container;
    document.body.appendChild(container);
  }

  onCleanup(() => {
    if (count() === 1) {
      document.body.removeChild(container!);
      timeouts.forEach(timeout => clearTimeout(timeout));
    }
    decrement();
  });

  return {
    toast,
    toastGroup: <ToastGroup toasts={toasts} node={container} />
  };
};

const Toast: Component<{
  content: string
}> = (props) => {
  return <div class={styles.item}>
    {props.content}
  </div>;
};

const ToastGroup: Component<{
  node: Node;
  toasts: readonly string[];
}> = (props) => {
  return <Portal mount={props.node}>
    <div class={styles.group}>
      <For each={props.toasts}>
        {(toast) => <Toast content={toast} />}
      </For>
    </div>
  </Portal>;
};

const ToastContext = createContext<{
  count: Accessor<number>;
  increment: () => number;
  decrement: () => number;
}>();

export const ToastContextProvider: Component<{
  children: JSX.Element;
}> = (props) => {
  const [count, setCount] = createSignal(0);
  const store = {
    count,
    increment: () => setCount(c => c + 1),
    decrement: () => setCount(c => c - 1),
  };
  return (
    <ToastContext.Provider value={store}>
      {props.children}
    </ToastContext.Provider>
  );
};
