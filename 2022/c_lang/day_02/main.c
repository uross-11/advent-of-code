#include <stdio.h>

int main() {
  int CHUNK = 512;
  char line[CHUNK];
  FILE *file = fopen("2.input", "r");
  int part1 = 0;
  int part2 = 0;

  if (file == NULL) {
    printf("file can't be opened \n");
  }

  while (fgets(line, CHUNK, file)) {
    int delta1 = (line[2] - line[0] - 23 + 3) % 3;
    int delta2 = (line[2] + line[0] - 65 - 88) % 3;

    if (delta1 == 1) {
      part1 += 6;
    }
    if (delta1 == 0) {
      part1 += 3;
    }

    if (delta2 == 0) {
      delta2 = 3;
    }

    part1 += line[2] - 'X' + 1;
    part2 += delta2 + ((line[2] - 'X') * 3);
  }

  printf("part 1: %d\n", part1);
  printf("part 2: %d\n", part2);

  fclose(file);
  return 0;
}
