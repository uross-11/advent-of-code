#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct node {
  char data;
  struct node *next;
  struct node *prev;
} node;

typedef struct queue {
  node *head;
  node *tail;
} queue;

void init_queue(queue *q);
void enqueue(queue *q, char value);
char dequeue(queue *q);
queue *dequeue_multiple(queue *q, int quantity);
void push_multiple(queue *q, queue *new_queue);
void push(queue *q, char value);

int main() {
  int MAX_LINE = 512;
  char line[MAX_LINE];
  FILE *file = fopen("5.input", "r");

  if (file == NULL) {
    printf("file can't be opened \n");
    exit(1);
  }

  queue *table, *table2 = NULL;

  int is_done = 0;
  int currentSize = 0;

  while (fgets(line, MAX_LINE, file)) {

    if (line[0] == '\n') {
      is_done = 1;
      continue;
    }

    if (is_done) {
      char *instructions[6];
      instructions[0] = strtok(line, " ");

      for (int i = 1; i < 6; i++) {
        instructions[i] = strtok(NULL, " ");
      }

      int quantity = strtol(instructions[1], NULL, 10);
      int origin = strtol(instructions[3], NULL, 10);
      int destination = strtol(instructions[5], NULL, 10);

      // first solution
      for (int i = 0; i < quantity; i++) {
        char item = dequeue(&table[origin - 1]);
        push(&table[destination - 1], item);
      }

      // second solution
      queue *new_queue = dequeue_multiple(&table2[origin - 1], quantity);
      push_multiple(&table2[destination - 1], new_queue);

    } else {
      int i = 1;
      char item = line[i];

      while (item != '\n') {
        if (item >= 'A' && item <= 'Z') {
          int index = (i - 1) / 4;

          if (index >= currentSize) {
            queue *new_table = realloc(table, (index + 1) * sizeof(queue));
            queue *new_table2 = realloc(table2, (index + 1) * sizeof(queue));
            if (new_table == NULL) {
              printf("Memory reallocation failed\n");
              exit(1);
            }
            table = new_table;
            table2 = new_table2;

            for (int j = currentSize; j <= index; j++) {
              init_queue(&table[j]);
              init_queue(&table2[j]);
            }
            currentSize = index + 1;
          }

          enqueue(&table[index], item);
          enqueue(&table2[index], item);
        }
        i++;
        item = line[i];
      }
    }
  }
  printf("\n");

  // print first solution
  for (int i = 0; i < currentSize; i++) {
    printf("%c", dequeue(&table[i]));
  }

  printf("\n");

  // print second solution
  for (int i = 0; i < currentSize; i++) {
    printf("%c", dequeue(&table2[i]));
  }
  printf("\n");

  for (int i = 0; i < currentSize; i++) {
    while (table[i].head != NULL) {
      dequeue(&table[i]);
    }
  }

  free(table);
  free(table2);
  fclose(file);

  return 0;
}

void init_queue(queue *q) {
  q->head = NULL;
  q->tail = NULL;
}

void enqueue(queue *q, char value) {
  node *new_node = malloc(sizeof(node));
  if (new_node == NULL) {
    printf("Memory allocation failed\n");
    exit(1);
  }
  new_node->data = value;
  new_node->next = NULL;

  if (q->tail != NULL) {
    q->tail->next = new_node;
  }
  q->tail = new_node;

  if (q->head == NULL) {
    q->head = new_node;
  }
}

void push_multiple(queue *q, queue *new_queue) {
  if (new_queue->head == NULL) {
    printf("Queue is empty\n");
    exit(1);
  }

  new_queue->tail->next = q->head;
  q->head = new_queue->head;

  if (q->tail == NULL) {
    q->tail = new_queue->tail;
  }
}

void push(queue *q, char value) {
  node *new_node = malloc(sizeof(node));
  if (new_node == NULL) {
    printf("Memory allocation failed\n");
    exit(1);
  }
  new_node->data = value;
  new_node->prev = NULL;

  new_node->next = q->head;
  q->head = new_node;

  if (q->tail == NULL) {
    q->tail = new_node;
  }
}

char pop(queue *q) {
  if (q->head == NULL) {
    printf("Queue is empty\n");
    exit(1);
  }

  node *temp = q->tail;
  char value = temp->data;

  q->tail = q->tail->prev;
  if (q->tail == NULL) {
    q->head = NULL;
  }
  free(temp);

  return value;
}

queue *dequeue_multiple(queue *q, int quantity) {
  if (q->head == NULL) {
    printf("Queue is empty\n");
    exit(1);
  }

  queue *new_queue = malloc(sizeof(queue));
  if (new_queue == NULL) {
    printf("Memory allocation failed\n");
    exit(1);
  }
  init_queue(new_queue);

  for (int i = 0; i < quantity; i++) {
    char item = dequeue(q);
    enqueue(new_queue, item);
  }

  return new_queue;
}

char dequeue(queue *q) {
  if (q->head == NULL) {
    printf("Queue is empty\n");
    exit(1);
  }

  node *temp = q->head;
  char value = temp->data;

  q->head = q->head->next;
  if (q->head == NULL) {
    q->tail = NULL;
  }
  free(temp);

  return value;
}
