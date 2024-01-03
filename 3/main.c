#include <stdio.h>

int main() {
  int CHUNK = 512;
  char line[CHUNK];
  FILE *file = fopen("3.input", "r");

  if (file == NULL) {
    printf("file can't be opened \n");
  }

  while (fgets(line, CHUNK, file)) {
    int sum = 0;

    for (int i = 0; i < CHUNK; i++) {
      if (line[i] == '\n')
        break;

      printf("(%d,%c)", line[i], line[i]);
      sum += line[i] - 97;
    }

    /* printf("%d\n", sum); */
    /* printf("%d", 'a'); */
  }
}
