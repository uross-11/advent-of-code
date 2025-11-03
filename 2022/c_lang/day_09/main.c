#include <stdio.h>
#include <stdlib.h>

typedef struct node {
  int x;
  int y;

  struct node *next;
} node;

void move_tail(node *head, node *tail) {
  int dx = head->x - tail->x;
  int dy = head->y - tail->y;

  if (abs(dx) <= 1 && abs(dy) <= 1) {
    return;
  }

  if (dx > 0)
    tail->x++;
  else if (dx < 0)
    tail->x--;

  if (dy > 0)
    tail->y++;
  else if (dy < 0)
    tail->y--;
}

void move_head(int amount, char dir, node *head) {
  node *last_node = head->next;

  for (int i = 0; i < amount; i++) {
    switch (dir) {
      case 'L':
        head->x--;
        break;
      case 'R':
        head->x++;
        break;
      case 'D':
        head->y--;
        break;
      case 'U':
        head->y++;
        break;
    }

    printf("x: %d y: %d \n", head->x, head->y);

    while (last_node != NULL) {
      move_tail(head, last_node);
      last_node = last_node->next;
    }
  }
}

node *init_rope() {
  node *head = malloc(sizeof(node));
  if (!head) {
    exit(1);
  }

  node *tail = malloc(sizeof(node));
  if (!tail) {
    free(head);
    exit(1);
  }

  head->x = 0;
  head->y = 0;
  head->next = tail;

  tail->x = 0;
  tail->y = 0;
  tail->next = NULL;

  return head;
}

int main() {
  FILE *f;
  if ((f = fopen("9.test", "r")) == NULL) exit(1);

  char *line = NULL;
  ssize_t linelen;
  size_t linecap;

  node *rope1 = init_rope();

  while ((linelen = getline(&line, &linecap, f)) > 0) {
    char dir = line[0];
    int amount = line[2] - '0';

    move_head(amount, dir, rope1);
  }

  free(line);
  free(rope1);
  fclose(f);

  exit(0);
}
