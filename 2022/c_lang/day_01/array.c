#include "array.h"
#include <stdlib.h>

// order of sorting
int compare(const void *a, const void *b) {
  int x = *(int *)a;
  int y = *(int *)b;
  return y - x;
}

void init_array(Array *a, size_t initialSize) {
  // (pointer)->(variable) get variable value of pointer
  // sizeof(int) can be changed to something else?
  a->array = malloc(initialSize * sizeof(int));
  a->used = 0;
  a->size = initialSize;
}

void insert_array(Array *a, int element) {
  if (a->used == a->size) {
    a->size *= 2;
    a->array = realloc(a->array, a->size * sizeof(int));
  }
  a->array[a->used++] = element;
}

// qsort
void sort_array(Array *a) { qsort(a->array, a->used, sizeof(int), compare); }

void free_array(Array *a) {
  free(a->array);
  a->array = NULL;
  a->used = a->size = 0;
}
