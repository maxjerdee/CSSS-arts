# Testing what the game of life could look like on the beatpad

# Import the necessary libraries

import pygame
from pygame import mixer

pygame.init()

pygame.mixer.set_num_channels(50)

# font = pygame.font.Font('assets/Terserah.ttf', 48)
# medium_font = pygame.font.Font('assets/Terserah.ttf', 28)
# small_font = pygame.font.Font('assets/Terserah.ttf', 16)
# real_small_font = pygame.font.Font('assets/Terserah.ttf', 10)
fps = 60
timer = pygame.time.Clock()
WIDTH = 52 * 35
HEIGHT = 400
screen = pygame.display.set_mode([WIDTH, HEIGHT])
pygame.display.set_caption('My Python Piano')


run = True
while run:
    timer.tick(fps)
    screen.fill('gray')

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            run = False

    pygame.display.flip()
pygame.quit()


# # Define the board size
# n = 8

# # Define the initial state of the board
# board = [[0 for i in range(n)] for j in range(n)]
# board[3][3] = 1
# board[3][4] = 1
# board[4][3] = 1
# board[4][4] = 1

# # Define the rules of the game of life
# def update_board(board):
#     new_board = [[0 for i in range(n)] for j in range(n)]
#     for i in range(n):
#         for j in range(n):
#             count = 0
#             for i2 in range(i-1,i+2):
#                 for j2 in range(j-1,j+2):
#                     if i2 >= 0 and i2 < n and j2 >= 0 and j2 < n:
#                         count += board[i2][j2]
#             count -= board[i][j]
#             if board[i][j] == 1 and (count < 2 or count > 3):
#                 new_board[i][j] = 0
#             elif board[i][j] == 0 and count == 3:
#                 new_board[i][j] = 1
#             else:
#                 new_board[i][j] = board[i][j]
#     return new_board

# # Define function to display the board