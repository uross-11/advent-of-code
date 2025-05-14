#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// mind = blown
/* #define MAX(a, b) ((a) >= (b) ? (a) : (b)) */
/* #define MIN(a, b) ((a) <= (b) ? (a) : (b)) */

int main() {
  int MAX_LINE = 512;
  char line[MAX_LINE];
  FILE *file = fopen("4.input", "r");

  if (file == NULL) {
    printf("file can't be opened \n");
  }

  int part_1 = 0;
  int part_2 = 0;

  while (fgets(line, MAX_LINE, file)) {
    char *left = strtok(line, ",");
    char *right = strtok(NULL, ",");

    long left_1 = strtol(strtok(left, "-"), NULL, 10);
    long left_2 = strtol(strtok(NULL, "-"), NULL, 10);

    long right_1 = strtol(strtok(right, "-"), NULL, 10);
    long right_2 = strtol(strtok(NULL, "-"), NULL, 10);

    long left_len = left_2 - left_1 + 1;
    long right_len = right_2 - right_1 + 1;

    if (left_1 <= right_2 && right_1 <= left_2) {
      part_2++;
    }

    if (left_1 <= right_1 && left_2 >= right_2 ||
        right_1 <= left_1 && right_2 >= left_2) {

      part_1++;
      continue;
    }
  }

  printf("part 1: %d\n", part_1);
  printf("part 2: %d\n", part_2);

  return 0;
}
