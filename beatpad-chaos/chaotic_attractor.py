# Testing what the game of life could look like on the beatpad

# Import the necessary libraries

import pygame
import piano_lists as pl
from pygame import mixer

pygame.init()
pygame.mixer.set_num_channels(50)

# font = pygame.font.Font('assets/Terserah.ttf', 48)
# medium_font = pygame.font.Font('assets/Terserah.ttf', 28)
# small_font = pygame.font.Font('assets/Terserah.ttf', 16)
# real_small_font = pygame.font.Font('assets/Terserah.ttf', 10)
fps = 20
game_tick_rate = 4
timer = pygame.time.Clock()
WIDTH = 400
HEIGHT = 400
screen = pygame.display.set_mode([WIDTH, HEIGHT])
pygame.display.set_caption('My Python Piano')

white_notes = pl.white_notes
black_notes = pl.black_notes
black_labels = pl.black_labels
piano_notes = pl.piano_notes
white_sounds = []
black_sounds = []
piano_sounds = []


for i in range(len(white_notes)):
    white_sounds.append(mixer.Sound(f'notes\\{white_notes[i]}.wav'))

for i in range(len(black_notes)):
    black_sounds.append(mixer.Sound(f'notes\\{black_notes[i]}.wav'))

white_sounds[0].play(0, 3000)

# Define the board size
n = 8

# Define the initial state of the board with a glider
board = [[0 for i in range(n)] for j in range(n)]
board[1][2] = 1
board[2][3] = 1
board[3][1] = 1
board[3][2] = 1
board[3][3] = 1


# Define the rules of the game of life (with periodic boundary conditions)
def update_board(board):
    new_board = [[0 for i in range(n)] for j in range(n)]
    for i in range(n):
        for j in range(n):
            count = 0
            for x in range(-1, 2):
                for y in range(-1, 2):
                    if not (x == 0 and y == 0):
                        count += board[(i + x) % n][(j + y) % n]
            if board[i][j] == 1:
                if count < 2 or count > 3:
                    new_board[i][j] = 0
                else:
                    new_board[i][j] = 1
            else:
                if count == 3:
                    new_board[i][j] = 1
    return new_board

# Define function to display the board
def display_board(board):
    squares = []
    for i in range(n):
        for j in range(n):
            if board[i][j] == 1:
                square = pygame.draw.rect(screen, 'black', (i * 50, j * 50, 50, 50))
            else:
                square = pygame.draw.rect(screen, 'white', (i * 50, j * 50, 50, 50))
            squares.append(square)
    return squares

mode = "LEFT"

# Play the sounds associated with the board. Modes are to play all active squares, to play only the left most, or the right most
def play_board(board):
    if mode == "ALL":
        for i in range(n):
            for j in range(n):
                if board[i][j] == 1:
                    white_sounds[(i * n + j) % len(white_sounds)].play(0,1000)
    elif mode == "LEFT":
        for i in range(n):
            min_j = n
            for j in range(n):
                if board[i][j] == 1:
                    min_j = min(min_j, j)
            if min_j < n:
                white_sounds[(i * n + min_j) % len(white_sounds)].play(0,1000)


# Run the game of life
run = True
while run:
    timer.tick(fps)
    screen.fill('gray')
    if pygame.time.get_ticks() % (fps/game_tick_rate) == 0:
        board = update_board(board)
        play_board(board)
    
    squares = display_board(board)

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            run = False
        if event.type == pygame.MOUSEBUTTONDOWN:
            for i in range(n):
                for j in range(n):
                    if squares[i * n + j].collidepoint(event.pos):
                        board[i][j] = 1 - board[i][j]
                        white_sounds[(i * n + j) % len(white_sounds)].play()

    pygame.display.flip()

pygame.quit()