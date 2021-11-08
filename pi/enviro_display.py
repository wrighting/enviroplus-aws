import logging
import colorsys
import ST7735

from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont

from fonts.ttf import RobotoMedium as UserFont

class EnviroDisplay():

    def __init__(self, config, variables):

        self.logger = logging.getLogger(__name__)
        self.logger.setLevel(logging.INFO)

        # Create ST7735 LCD display class
        st7735 = ST7735.ST7735(
            port=0,
            cs=1,
            dc=9,
            backlight=12,
            rotation=270,
            spi_speed_hz=10000000
        )
        # Initialize display
        st7735.begin()

        self.WIDTH = st7735.width
        self.HEIGHT = st7735.height

        # Set up canvas and font
        self.img = Image.new('RGB', (self.WIDTH, self.HEIGHT), color=(0, 0, 0))
        self.draw = ImageDraw.Draw(self.img)
        font_size = 20
        self.font = ImageFont.truetype(UserFont, font_size)

        self.display = st7735

        self.values = {}

        for v in variables:
            self.values[v] = [1] * self.WIDTH

    # Displays data and text on the 0.96" LCD
    def display_text(self, variable, data, unit):

        # The position of the top bar
        top_pos = 25

        # Maintain length of list
        self.values[variable] = self.values[variable][1:] + [data]
        # Scale the values for the variable between 0 and 1
        colours = [(v - min(self.values[variable]) + 1) / (max(self.values[variable])
                   - min(self.values[variable]) + 1) for v in self.values[variable]]
        # Format the variable name and value
        message = "{}: {:.1f} {}".format(variable[:4], data, unit)
        # self.logger.info(message)
        self.draw.rectangle((0, 0, self.WIDTH, self.HEIGHT), (255, 255, 255))
        for i in range(len(colours)):
            # Convert the values to colours from red to blue
            colour = (1.0 - colours[i]) * 0.6
            r, g, b = [int(x * 255.0) for x in colorsys.hsv_to_rgb(colour,
                       1.0, 1.0)]
            # Draw a 1-pixel wide rectangle of colour
            self.draw.rectangle((i, top_pos, i+1, self.HEIGHT), (r, g, b))
            # Draw a line graph in black
            line_y = self.HEIGHT - (top_pos + (colours[i] * (self.HEIGHT - top_pos)))\
                     + top_pos
            self.draw.rectangle((i, line_y, i+1, line_y+1), (0, 0, 0))
        # Write the text at the top in black
        self.draw.text((0, 0), message, font=self.font, fill=(0, 0, 0))
        self.display.display(self.img)

