#include <stdio.h>
#include <string.h>

void calculate1(char *line, int *sum);
void calculate2(char *line, int *sum, int i, char seen_3lines[3][53]);
int char_to_int(char c);

int main() {
  int MAX_LINE = 512;
  char line[MAX_LINE];
  FILE *file = fopen("3.input", "r");

  char seen_3lines[3][53] = {0};

  int sum = 0;
  int sum2 = 0;
  int i = 0;

  while (fgets(line, MAX_LINE, file)) {

    calculate1(line, &sum);
    calculate2(line, &sum2, i, seen_3lines);

    i++;
  }

  fclose(file);
  printf("%i\n", sum);
  printf("%i\n", sum2);

  return 0;
}

void calculate1(char *line, int *sum) {
  char seen[53] = {0};
  unsigned long len = strlen(line);

  for (int i = 0; i < len; i++) {
    int p;

    if (i == len / 2) {
      p = 0;
    }

    if (i >= len / 2 && seen[p]) {
      *sum += p;
      break;
    }

    p = char_to_int(line[i]);

    if (i < len / 2) {
      seen[p] = 1;
    }
  }
}

void calculate2(char *line, int *sum2, int i, char seen_3lines[3][53]) {
  unsigned long len = strlen(line);

  for (int j = 0; j < len; j++) {
    int p = char_to_int(line[j]);

    seen_3lines[i % 3][p] = 1;

    /* printf("[%i, %i, %i] ===> %c\n", seen_3lines[0][p], seen_3lines[1][p], */
    /*        seen_3lines[2][p], line[j]); */

    if (seen_3lines[0][p] && seen_3lines[1][p] && seen_3lines[2][p]) {
      *sum2 += p;
      memset(seen_3lines, 0, sizeof(char[3][53]));
      break;
    }
  }
}

int char_to_int(char c) {
  if (c >= 'a' && c <= 'z') {
    return c - 'a' + 1;
  } else if (c >= 'A' && c <= 'Z') {
    return c - 'A' + 27;
  }

  return 0;
}
