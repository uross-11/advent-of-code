#include "array.c"
#include <stdio.h>
#include <stdlib.h>

#define CHUNK 1024

int main() {
  FILE *file;
  char buf[CHUNK];
  int sum = 0;
  Array arr;
  int second = 0;

  file = fopen("./1.input", "r");

  if (file == NULL) {
    printf("file can't be opened \n");
  }

  // dynamic int array, bc array length unknown
  // input file has an unknown number of lines
  init_array(&arr, 0);

  // fgets reads file line by line with max buffer value(2nd argument)
  while (fgets(buf, CHUNK, file)) {
    if (*buf == '\n' && sum > 0) {
      insert_array(&arr, sum);
      sum = 0;
    } else {
      // change atoi to strtol and sum to long
      sum += atoi(buf);
    }
  }

  sort_array(&arr);

  for (int i = 0; i < 3; i++) {
    second += arr.array[i];
  }

  printf("1. answer: %d\n", arr.array[0]);
  printf("2. answer: %d\n", second);

  free_array(&arr);
  fclose(file);

  return 0;
}
