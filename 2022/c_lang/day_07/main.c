#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef enum type {
  TYPE_FILE,
  TYPE_DIR,
} type;

typedef struct entry {
  type type;
  union {
    struct file *file;
    struct dir *dir;
  };
} entry;

typedef struct list {
  entry **data;
  int size;
} list;

typedef struct file {
  char *name;
  unsigned long size;
} file;

typedef struct dir {
  char *name;
  struct dir *parent;
  list *entries;
  unsigned long size;
} dir;

typedef enum { NONE, LS, CD } cmd;

dir *init_dir(dir *parent, char *name) {
  dir *new = malloc(sizeof(dir));

  new->name = name;
  new->parent = parent;
  new->entries = malloc(sizeof(list));
  new->entries->data = malloc(sizeof(entry *) * 100);
  new->entries->size = 0;
  new->size = 0;

  return new;
}

entry *add_dir(dir *d) {
  entry *e = malloc(sizeof(entry));
  e->type = TYPE_DIR;
  e->dir = d;
  return e;
}

entry *add_file(dir *d, char *name, unsigned long size) {
  entry *e = malloc(sizeof(entry));
  e->type = TYPE_FILE;
  e->file = malloc(sizeof(file));
  e->file->name = name;
  e->file->size = size;
  return e;
}

void print_all(dir *d, int indent) {
  for (int i = 0; i < indent; i++)
    printf("  ");
  printf("%s| %s (dir, total: %lu)%s\n", "\x1B[32m", d->name, d->size,
         "\x1B[37m");

  for (int i = 0; i < d->entries->size; i++) {
    entry *e = d->entries->data[i];

    if (e->type == TYPE_DIR) {
      print_all(e->dir, indent + 1);
    } else if (e->type == TYPE_FILE) {
      for (int j = 0; j < indent + 1; j++)
        printf("  ");
      printf("%s| %s (file, size=%lu)%s\n", "\x1B[33m", e->file->name,
             e->file->size, "\x1B[37m");
    }
  }
}

void sum_dirs(dir *d, unsigned long max_size, unsigned long *sum) {
  if (d->size <= max_size) {
    *sum += d->size;
  }

  for (int i = 0; i < d->entries->size; i++) {
    entry *e = d->entries->data[i];
    if (e->type == TYPE_DIR) {
      sum_dirs(e->dir, max_size, sum);
    }
  }
}

int main() {
  FILE *file = fopen("7.input", "r");

  if (file == NULL) {
    printf("file can't be opened \n");
    return 1;
  }

  char buf[4096];
  cmd last_cmd = NONE;

  dir *root = init_dir(NULL, "/");
  dir *current = root;

  while (fgets(buf, sizeof(buf), file) != NULL) {
    buf[strcspn(buf, "\n")] = 0;

    if (buf[0] == '$') {
      last_cmd = NONE;

      if (strncmp(buf + 2, "cd", 2) == 0) {
        if (strncmp(buf + 5, "..", 2) == 0) {
          if (current->parent != NULL) {
            current = current->parent;
            continue;
          }
        }

        entry **entries = current->entries->data;
        int s = current->entries->size;

        if (s == 0)
          continue;

        for (int i = 0; i < s; i++) {
          entry *ent = entries[i];

          if (ent->type == TYPE_DIR && strcmp(ent->dir->name, buf + 5) == 0) {
            current = ent->dir;
            break;
          }
        }
      }

      if (strncmp(buf + 2, "ls", 2) == 0) {
        last_cmd = LS;
      }

      continue;
    }

    if (last_cmd == LS) {
      char *name = strdup(buf + 4);

      if (buf[0] == 'd') {
        dir *d = init_dir(current, name);
        entry *e = add_dir(d);
        current->entries->data[current->entries->size++] = e;
      } else {
        char *size_str = strtok(buf, " ");
        unsigned long size = strtoul(size_str, NULL, 10);
        entry *e = add_file(current, name, size);
        current->entries->data[current->entries->size++] = e;

        dir *parent = current;

        while (parent != NULL) {
          parent->size += size;
          parent = parent->parent;
        }
      }
    }
  }

  print_all(root, 0);

  unsigned long solution_1 = 0;
  sum_dirs(root, 100000, &solution_1);
  printf("solution 1: %lu\n", solution_1);

  return 0;
}
