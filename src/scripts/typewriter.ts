type QueueItem = () => Promise<void>;

class TypeWriter {
  #queue: QueueItem[] = [];
  #element: HTMLElement;
  #loop: boolean;
  #typingSpeed: number;
  #deletingSpeed: number;

  constructor(
    parent: HTMLElement,
    { loop = false, typingSpeed = 50, deletingSpeed = 50 },
  ) {
    this.#element = document.createElement("div");
    parent.appendChild(this.#element);
    this.#loop = loop;
    this.#typingSpeed = typingSpeed;
    this.#deletingSpeed = deletingSpeed;
  }

  typeString(sentence: string) {
    console.log("typeString");
    // Function to be executed asynchronously
    this.#addToQueue((resolve) => {
      let i = 0;

      // Interval to simulate typing effect
      const interval = setInterval(() => {
        // Get the current character from the sentence
        const currentChar = sentence[i];
        if (typeof currentChar === "string") {
          this.#element.append(currentChar);
          i++;

          // If all characters are typed, clear the interval and resolve the promise
          if (i >= sentence.length) {
            clearInterval(interval);
            resolve();
          }
        }
      }, this.#typingSpeed);
    });

    return this;
  }

  deleteChars(num: number) {
    this.#addToQueue((resolve) => {
      let i = 0;
      const interval = setInterval(() => {
        this.#element.innerText = this.#element.innerText.substring(
          0,
          this.#element.innerText.length - 1,
        );
        i++;

        if (i >= num) {
          clearInterval(interval);
          resolve();
        }
      }, this.#deletingSpeed);
    });

    return this;
  }

  deleteAll(deleteSpeed = this.#deletingSpeed) {
    this.#addToQueue((resolve) => {
      const interval = setInterval(() => {
        this.#element.innerText = this.#element.innerText.substring(
          0,
          this.#element.innerText.length - 1,
        );

        if (this.#element.innerText.length === 0) {
          clearInterval(interval);
          resolve();
        }
      }, deleteSpeed);
    });

    return this;
  }

  pauseFor(duration: number) {
    this.#addToQueue((resolve) => {
      setTimeout(resolve, duration);
    });

    return this;
  }

  async start() {
    let callback = this.#queue.shift();
    while (callback) {
      await callback();
      console.log("callback complete");
      if (this.#loop) {
        this.#queue.push(callback);
      }
      callback = this.#queue.shift();
    }
  }

  #addToQueue(callback: (resolve: () => void) => void) {
    // Enqueue a function that returns a promise
    this.#queue.push(() => new Promise(callback));
  }
}

const el = document.getElementById("whitespace");
console.log(el);
if (el) {
  const typewriter = new TypeWriter(el, {
    loop: true,
    typingSpeed: 100,
    deletingSpeed: 100,
  });

  typewriter
    .typeString("we handmake app")
    .pauseFor(1000)
    .deleteAll()
    .typeString("we consult to help your business succeed")
    .pauseFor(1000)
    .deleteAll()
    .typeString("we contract for specifc projects")
    .pauseFor(1000)
    .deleteAll()
    .start();
}
