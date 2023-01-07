use std::io::BufRead;
use std::io::Cursor;

use byteorder::{LittleEndian, ReadBytesExt};
use clap::Parser;
use hmac::{Hmac, Mac};
use sha3::Sha3_256;

#[derive(Parser, Debug)]
#[command()]
struct Args {
    #[arg(long)]
    file: String,
    #[arg(long)]
    numbilets: u32,
    #[arg(long)]
    parameter: String,
}

fn read_lines<P>(filename: P) -> std::io::Result<std::io::Lines<std::io::BufReader<std::fs::File>>>
    where P: AsRef<std::path::Path>, {
    let file = std::fs::File::open(filename)?;
    Ok(std::io::BufReader::new(file).lines())
}

fn get_num(x: &str, param: &str, nums: u32) -> anyhow::Result<u32> {
    let mut mac = Hmac::<Sha3_256>::new_from_slice((param).as_ref())?;
    mac.update((x).as_ref());
    let mut rdr = Cursor::new(mac.finalize().into_bytes());

    Ok(rdr.read_u32::<LittleEndian>().unwrap() % nums + 1)
}

fn run(args: &Args) -> anyhow::Result<()> {
    for line in read_lines(&args.file)? {
        let line = line?;
        let num = get_num(&line, &args.parameter, args.numbilets)?;
        println!("{}: {}", line, num);
    }
    Ok(())
}

fn main() {
    let args = match Args::try_parse() {
        Ok(x) => x,
        Err(e) => {
            eprintln!("{}", e);
            return;
        }
    };
    if let Err(e) = run(&args) {
        eprintln!("{}", e);
    }
}
