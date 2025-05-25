#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void free_f(FILE *f, char *line) {
  free(line);
  fclose(f);
  exit(1);
}

typedef enum { TOP, RIGHT, BOTTOM, LEFT } dir;

int is_blocked(char **table, int x, int y, int w, int h, dir d) {
  char item = table[x][y];

  switch (d) {
  case TOP:
    for (int i = x - 1; i >= 0; i--) {
      if (table[i][y] >= item)
        return 1;
    }
    break;
  case BOTTOM:
    for (int i = x + 1; i < h; i++) {
      if (table[i][y] >= item)
        return 1;
    }
    break;
  case LEFT:
    for (int j = y - 1; j >= 0; j--) {
      if (table[x][j] >= item)
        return 1;
    }
    break;
  case RIGHT:
    for (int j = y + 1; j < w; j++) {
      if (table[x][j] >= item)
        return 1;
    }
    break;
  }

  return 0;
}

int count_visible(char **table, int x, int y, int w, int h, dir d) {
  char item = table[x][y];
  int c = 0;

  switch (d) {
  case TOP:
    for (int i = x - 1; i >= 0; i--) {
      c++;
      if (table[i][y] >= item)
        break;
    }
    break;
  case BOTTOM:
    for (int i = x + 1; i < h; i++) {
      c++;
      if (table[i][y] >= item)
        break;
    }
    break;
  case LEFT:
    for (int j = y - 1; j >= 0; j--) {
      c++;
      if (table[x][j] >= item)
        break;
    }
    break;
  case RIGHT:
    for (int j = y + 1; j < w; j++) {
      c++;
      if (table[x][j] >= item)
        break;
    }
    break;
  }

  return c;
}

int is_visible_any_dir(char **table, int i, int j, int w, int h) {
  if (is_blocked(table, i, j, w, h, TOP) == 0)
    return 1;
  if (is_blocked(table, i, j, w, h, RIGHT) == 0)
    return 1;
  if (is_blocked(table, i, j, w, h, BOTTOM) == 0)
    return 1;
  if (is_blocked(table, i, j, w, h, LEFT) == 0)
    return 1;

  return 0;
}

int scenic_score(char **table, int i, int j, int w, int h) {
  int c_top = count_visible(table, i, j, w, h, TOP);
  int c_right = count_visible(table, i, j, w, h, RIGHT);
  int c_bottom = count_visible(table, i, j, w, h, BOTTOM);
  int c_left = count_visible(table, i, j, w, h, LEFT);

  return c_top * c_right * c_bottom * c_left;
}

int main() {
  FILE *f;
  if ((f = fopen("8.input", "r")) == NULL)
    exit(1);

  char *line = NULL;
  ssize_t linelen;
  size_t linecap;
  char **table = NULL;
  int w = -1, h = 0, i, j;

  while ((linelen = getline(&line, &linecap, f)) != -1) {
    if (line[linelen - 1] == '\n')
      line[linelen--] = '\0';

    if (w == -1)
      w = linelen;
    else if (linelen != w) {
      free_f(f, line);
    }

    table = realloc(table, sizeof(char *) * (h + 1));
    if (!table)
      free_f(f, line);

    table[h] = malloc(w);
    if (!table[h])
      free_f(f, line);

    memcpy(table[h], line, w);

    h++;
  }

  free(line);
  fclose(f);

  int solution_1 = 0;
  int solution_2 = 0;

  for (i = 0; i < h; i++) {
    for (j = 0; j < w; j++) {
      if (is_visible_any_dir(table, i, j, w, h) == 1)
        solution_1++;

      int score = scenic_score(table, i, j, w, h);
      if (score > solution_2)
        solution_2 = score;
    }
  }

  printf("solution 1: %d\n", solution_1);
  printf("solution 2: %d\n", solution_2);

  for (int i = 0; i < h; i++)
    free(table[i]);
  free(table);

  exit(0);
}
